const db = require("../config/conection");
const { faker } = require("@faker-js/faker");
const { Post, User } = require("../models");

const profileImages = [
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
  "p12",
  "p13",
];
const postImages = [
  "post1",
  "post2",
  "post3",
  "post4",
  "post5",
  "post6",
  "post7",
  "post8",
];

db.once("open", async () => {
  await Post.deleteMany({});
  await User.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const fullName = firstName + lastName;
    // use full name concat to generate an email address
    const email = faker.internet.email(fullName);
    const password = faker.internet.password();
    const location = faker.address.cityName();
    const occupation = faker.name.jobTitle();
    const viewedProfile = faker.datatype.number({ max: 15000 });
    const impressions = faker.datatype.number({ max: 250000 });
    // generate a random image for a profile picture
    const randomProfileIndex = Math.floor(Math.random() * profileImages.length);
    const picturePath = profileImages[randomProfileIndex].toString() + ".jpeg";

    userData.push({
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      viewedProfile,
      impressions,
      picturePath,
    });
  }
  const createdUsers = await User.collection.insertMany(userData);
  // create friends
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];

    let friendId = userId;
    while (friendId === userId) {
      const randomUserIndex = Math.floor(
        Math.random() * createdUsers.ops.length
      );
      friendId = createdUsers.ops[randomUserIndex];
    }
    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

  // create Posts
  let createdPosts = [];
  for (let i = 0; i < 100; i += 1) {
    const description = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const randomImageIndex = Math.floor(Math.random() * postImages.length);
    const postImage = postImages[randomImageIndex].toString() + ".jpeg";

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const {
      firstName,
      lastName,
      _id: userId,
    } = createdUsers.ops[randomUserIndex];

    const createdPost = await Post.create({
      userId,
      description,
      postImage,
      firstName,
      lastName,
    });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { post: createdPost._id } }
    );
    createdPosts.push(createdPost);
  }

  // create comments
  for (let i = 0; i < 100; i += 1) {
    const commentBody = faker.lorem.words(Math.round(Math.random() * 29) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { firstName, lastName } = createdUsers.ops[randomUserIndex];

    const randomPostIndex = Math.floor(Math.random() * createdPosts.length);

    const { _id: postId } = createdPosts[randomPostIndex];

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: { commentBody, firstName, lastName } } },
      { runValidators: true }
    );
  }

  // create likes
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];

    const randomPostIndex = Math.floor(Math.random() * createdPosts.length);
    const { _id: postId } = createdPosts[randomPostIndex];

    await Post.updateOne(
      { _id: postId },
      { $set: { likes: { userId: true } } }
    );
  }

  console.log("all done!");
  process.exit(0);
});
