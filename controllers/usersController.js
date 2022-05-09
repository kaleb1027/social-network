const {Users, Thoughts} = require('../models');

module.exports = {
    getUsers(req, res){
        Users.find()
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json(err))
    },

    getUser(req, res) {
        Users.findOne({_id: req.params.userId})
            .select('-__v')
            .then((data) =>
                !data
                    ? res.status(404).json({message: "This user ID doesn't exist!"})
                    : res.json(data)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        Users.create(req.body)
          .then((data) => res.json(data))
          .catch((err) => res.status(500).json(err));
      },

      deleteUser(req, res) {
        Users.findOneAndDelete({ _id: req.params.userId })
          .then((data) =>
            !user
              ? res.status(404).json({ message: 'No user with that ID' })
              : Thoughts.deleteMany({ _id: { $in: data.thoughts } })
          )
          .then(() => res.json({ message: 'User and associated thought deleted!' }))
          .catch((err) => res.status(500).json(err));
      },
      
      updateUser(req, res) {
        Users.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(data)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      
      addFriend(req, res) {
        Users.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !user
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(data)
          )
          .catch((err) => res.status(500).json(err));
      },
     
      removeFriend(req, res) {
        Users.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(data)
          )
          .catch((err) => res.status(500).json(err));
      },
    };