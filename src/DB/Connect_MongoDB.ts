require("./models/Category.Model");
require("./models/Project.Model");
require("./models/Template.Model");
require("./models/User.Model");
import { set, connect } from "mongoose";

const DB_URL = process.env.DB_URL || "";
set("strictQuery", false);
export const connectMongoose = () => connect(DB_URL);
