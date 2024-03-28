/** @format */

import mongoose from "mongoose";
import { susbscriptionStatuses, roleNames } from "../utils/constants.js"

const { Schema, model } = mongoose;


const seatSchema = new Schema({
	role: {
		type: [String],
		enum: roleNames,
		default: "editor",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	free: {
		type: Number,
		default: 0,
	},
});

const accountPlanSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	seats: {
		type: [seatSchema],
		required: true,
	},
});

const accountSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	// owner_id: {
	// 	type: String,
	// 	required: true,
	// }, // TODO: Need to confirm the use case here owner_id.
	plan: {
		type: accountPlanSchema,
		required: true,
	},
	psp_customer_id: {
		type: String,
		required: false,
	},
	psp_payment_status: {
		type: Boolean,
		default: false,
	},
	psp_subscription_status: {
		type: [String],
		enum: susbscriptionStatuses,
		default: "trial",
	},
});

export const Account = model("accounts", accountSchema);


