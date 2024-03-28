/** @format */

import mongoose from "mongoose";
import { Product } from "./product.js";
import { Account } from "./account.js";

const { Schema, model, SchemaTypes } = mongoose;

const tabSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	product_id: {
		type: SchemaTypes.ObjectId,
		ref: Product,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
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

export const Tab = model("Tab", tabSchema);

