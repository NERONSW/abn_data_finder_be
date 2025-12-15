import mongoose from "mongoose";

//ABN Schema
const abnSchema = new mongoose.Schema(
  {
    abn: {
      type: String,
      required: true,
      trim: true,
    },

    entity_name: {
      type: String,
      required: true,
      trim: true,
    },

    other_entities: {
      type: [String],
      default: [],
    },

    state: {
      type: String,
      uppercase: true,
    },

    postcode: {
      type: String,
    },

    entity_type: {
      type: String,
    },

    abn_status: {
      type: String,
      required: true,
    },

    abn_status_from_date: {
      type: Date,
      required: true,
    },

    gst_status: {
      type: String,
    },

    gst_status_from_date: {
      type: Date,
    },

    asic_number: {
      type: String,
      trim: true,
    },

    asic_number_type: {
      type: String,
    },

    replaced: {
      type: String,
      enum: ["Y", "N"],
      default: "N",
    },

    record_last_updated: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//INDEXES – DESIGNED FOR FILTERING & SEARCH PERFORMANCE

// Exact lookup (unique ABN)
abnSchema.index({ abn: 1 }, { unique: true });

// Text search on names
abnSchema.index({
  entity_name: "text",
  other_entities: "text",
});

// Filter by state + abn_status + record_last_updated range
abnSchema.index({ state: 1, abn_status: 1, record_last_updated: -1 });

// Filter by abn_status + abn_status_from_date range
abnSchema.index({ abn_status: 1, abn_status_from_date: -1 });

// Filter by state + abn_status + abn_status_from_date range
abnSchema.index({ state: 1, abn_status: 1, abn_status_from_date: -1 });

// Filter by entity_type + abn_status + abn_status_from_date range
abnSchema.index({ entity_type: 1, abn_status: 1, abn_status_from_date: -1 });

// GST status + gst_status_from_date range
abnSchema.index({ gst_status: 1, gst_status_from_date: -1 });

// Entity type + record_last_updated range
abnSchema.index({ entity_type: 1, record_last_updated: -1 });

// ASIC number exact search
abnSchema.index({ asic_number: 1 });

// Replaced flag filter
abnSchema.index({ replaced: 1 });

// State + postcode exact search
abnSchema.index({ state: 1, postcode: 1 });

// Combined for entity type + state + date filtering
abnSchema.index({ entity_type: 1, state: 1, record_last_updated: -1 });

// Model
const ABN = mongoose.model("ABN", abnSchema);

export default ABN;
