import { Schema, model } from "mongoose";

const addressSchema: Schema = new Schema({});

const Address = model("Address", addressSchema);

export default Address;
