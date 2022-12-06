import User from  '../models/User.js';


/* READ */


export const getUser = async (req, res) => {
  try {
    // get the user id from the parameters and return all the relevant user data
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch(err) {
    res.status(404).json({ message: err.message });
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    // get the user's friends by their Id's
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // format data for the front end
    const formattedFriends =friends.map(({ _id, firstName, lastName, occupation, location, picturePath}) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    })
    res.status(200).json(formattedFriends);
  } catch(err) {
   res.status(404).json({ message: err.message });
  }
}
/** UPDATE */
export const addRemoveFriend = async(req, res) => {
  try {
    const { _id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    // if user IS within the user's friends array, then remove it on button click
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId );
      // also remove the user from the friend's friend array 
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // if user ISNT within the user's friends array, then add it on button click
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // format data for the front end
    const formattedFriends =friends.map(({ _id, firstName, lastName, occupation, location, picturePath}) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
    
  } catch(err) {
    res.status(404).json({ message: err.message });
  }
}