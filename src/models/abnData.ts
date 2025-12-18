import mongoose from "mongoose";

// Sub-schema for other_entities
const otherEntitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

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
    name_type: {
      type: String,
    },
    other_entities: {
      type: [otherEntitySchema],
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
    entity_name_normalized: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Indexing for search

//Exact-match unique fields
abnSchema.index({ abn: 1 }, { unique: true });
abnSchema.index({ asic_number: 1 });

//Text search
abnSchema.index({ entity_name: "text" });
abnSchema.index({ entity_name_normalized: 1 });

//Single-field filter indexes (frequent filters)
abnSchema.index({ state: 1 });
abnSchema.index({ postcode: 1 });
abnSchema.index({ entity_type: 1 });
abnSchema.index({ abn_status: 1 });
abnSchema.index({ gst_status: 1 });
abnSchema.index({ name_type: 1 });
abnSchema.index({ replaced: 1 });
abnSchema.index({ record_last_updated: -1 });

//Date-range filter indexes
abnSchema.index({ abn_status_from_date: -1 });
abnSchema.index({ gst_status_from_date: -1 });

// State + Postcode
abnSchema.index({
  state: 1,
  postcode: 1,
});

// ABN status + date + updated
abnSchema.index({
  abn_status: 1,
  abn_status_from_date: -1,
  record_last_updated: -1,
});

// GST status + date + updated
abnSchema.index({
  gst_status: 1,
  gst_status_from_date: -1,
  record_last_updated: -1,
});

// State + Postcode + ABN status + ABN date + updated
abnSchema.index({
  state: 1,
  postcode: 1,
  abn_status: 1,
  abn_status_from_date: -1,
  record_last_updated: -1,
});

// Entity type + State + Postcode + ABN status + ABN date + GST status + GST date + updated
abnSchema.index({
  entity_type: 1,
  state: 1,
  postcode: 1,
  abn_status: 1,
  abn_status_from_date: -1,
  gst_status: 1,
  gst_status_from_date: -1,
  record_last_updated: -1,
});

// Model
const ABN = mongoose.model("ABN", abnSchema);

export default ABN;
