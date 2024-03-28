import mongoose from "mongoose";
import { Account } from "./account.js";

const { Schema, model, SchemaTypes } = mongoose;

const productSchema = new Schema({
	id: {
		type: String,
		requried: true,
	},
	name: {
		type: String,
		required: true,
	},
	prod_slug: {
		type: String,
		required: false,
		lowercase: true,
	},
	account_id: {
		type: SchemaTypes.ObjectId,
		ref: Account,
		required: true,
	},
	version: {
		type: Number,
		required: true,
		default: 1,
	},
	created_by: {
		type: String,
		required: false
	},
	updated_by: {
		type: String,
		required: false
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

export const Product = model("Product", productSchema);

