const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/feelmeow");

// the Mongoose Schema is the structure of the documents in the collection
const catSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0, max: 30 },
  color: { type: String, enum: ['white', 'black', 'brown'] },
  avatarUrl: { type: String, default: 'images/default-avatar.png' },
  location: {
    address: String,
    city: String
  },
  countryCode: { type: String, match: /^[A-Z]{2}$/ },
  created: {
    type: Date,
    default: Date.now
  }
});

// Create the "Cat" model (interacts with the "cats" collection)
// Model names are SINGULAR, collection names PLURAL.
const Cat = mongoose.model("Cat", catSchema);
                  // model "Cat" -> "cat" -> "cats" collection

// create a new cat document (not in the DB yet)
const jeremieCat = new Cat({ name: "Lennox" });

// save the new cat document to the database
const jeremiePromise =
  jeremieCat.save()
    .then(() => {
      console.log("Saved Jeremie's cat!");
    })
    .catch((err) => {
      console.log("ERROR Jeremie's cat", err);
    });
// jeremieCat.save().then().catch();

const patrycjaCat = new Cat({ name: "Lyra" });
const patrycjaPromise =
  patrycjaCat.save()
    .then(() => {
      console.log("Saved Patrycja's cat!");
    })
    .catch((err) => {
      console.log("ERROR Patrycja's cat", err);
    });

// find all the cats
const findPromise =
  Cat.find({})
    .then((catsFromDb) => {
      catsFromDb.forEach((oneCat) => {
        // display name and _id for each cat
        console.log(`meow ${oneCat.name} id: ${oneCat._id}`);
      });
    })
    .catch((err) => {
      console.log("ERROR find", err);
    });


const removePromise =
  Cat.findByIdAndRemove("5acf24e87ef1e4bfd92070ad")
    .then(() => {
      console.log("Delete worked!");
    })
    .catch((err) => {
      console.log("DELETE failed 🤨", err);
    });

const updatePromise =
  Cat.findByIdAndUpdate("5acf29e80bf2f6c319cdd23c", { $inc: { age: 1 } })
    .then((updatedCat) => {
      console.log(`Update to: ${updatedCat.age}`);
    })
    .catch((err) => {
      console.log("UPDATE failed 😩", err);
    });


// After all the queries are done, disconnect.
Promise.all([
  jeremiePromise,
  patrycjaPromise,
  findPromise,
  removePromise,
  updatePromise
])
.then(() => {
  console.log("FINISHED! 🥐");
  mongoose.disconnect();
});
