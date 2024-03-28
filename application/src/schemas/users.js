import mongoose from "mongoose";
import { Account } from "./account.js";

const { Schema, model, SchemaTypes } = mongoose;

const userSchema = new Schema({
    id: {
        type: String,
        requried: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        lowercase: true,
        email: true
    },
    user_name: {
        type: String,
        required: false,
        lowercase: true,
    },
    slug: {
        type: String,
        required: false,
        lowercase: true,
    },
    account_id: {
        type: SchemaTypes.ObjectId,
        ref: Account,
        required: true,
    },
    created_at: {
        type: String,
        required: true
    },
    updated_at: {
        type: String,
        required: true
    }
});

export const User = model("User", userSchema);

