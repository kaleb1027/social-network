const {Thoughts, Users} = require('../models');

module.exports = {
    getThoughts(req, res){
        Thoughts.find()
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json(err))
    },

    getThought(req, res) {
        Thoughts.findOne({_id: req.params.thoughtId})
            .then((data) =>
                !data
                    ? res.status(404).json({message: "This ID doesn't exist!"})
                    : res.json(data)
            )
    },

    createThought(req, res){
        Thoughts.create(req.body)
            .then((data) => {
                return Users.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: data._id } },
                    { new: true}
                )
            })
            .then((user) =>
            !user
            ? res.status(404).json({
                message: 'Thought created, but found no user with that ID',
              })
            : res.json('Thought created!')
        )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json(data)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      
      deleteThought(req, res) {
        Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No thought with this id!' })
              : User.findOneAndUpdate(
                  { thoughts: req.params.thoughtId },
                  { $pull: { thought: req.params.thoughtId } },
                  { new: true }
                )
          )
          .then((user) =>
            !user
              ? res.status(404).json({
                  message: 'Thought created but no user with this id!',
                })
              : res.json({ message: 'Thought successfully deleted!' })
          )
          .catch((err) => res.status(500).json(err));
      },
      
      addReaction(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No thought found with this id!' })
              : res.json(data)
          )
          .catch((err) => res.status(500).json(err));
      },
     
      removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((data) =>
            !data
              ? res.status(404).json({ message: 'No thought found with this id!' })
              : res.json(data)
          )
          .catch((err) => res.status(500).json(err));
      },
    };
