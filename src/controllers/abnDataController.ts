import type { Request, Response, NextFunction } from "express";
import ABN from "../models/abnData.js";

export const getAllABNs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //Pagination

    const page = Math.max(parseInt(req.query.page as string) || 1, 1); // default 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // default 10, max 100
    const skip = (page - 1) * limit;

    //Build dynamic filter object
    const filter: Record<string, any> = {};

    // Equality filters
    if (req.query.abn) filter.abn = req.query.abn;
    if (req.query.postcode) filter.postcode = req.query.postcode;
    if (req.query.abn_status) filter.abn_status = req.query.abn_status;
    if (req.query.gst_status) filter.gst_status = req.query.gst_status;
    if (req.query.replaced) filter.replaced = req.query.replaced;
    if (req.query.asic_number) filter.asic_number = req.query.asic_number;
    if (req.query.name_type) filter.name_type = req.query.name_type;

    //Multi value filters
    const states = parseMultiValue(req.query.state as string);
    if (states?.length) {
      filter.state = { $in: states };
    }
    const entityTypes = parseMultiValue(req.query.entity_type as string);
    if (entityTypes?.length) {
      filter.entity_type = { $in: entityTypes };
    }

    //Date-range filters
    const dateFilters: { field: string; start?: string; end?: string }[] = [
      {
        field: "abn_status_from_date",
        start: req.query.abn_status_from_date_start as string,
        end: req.query.abn_status_from_date_end as string,
      },
      {
        field: "gst_status_from_date",
        start: req.query.gst_status_from_date_start as string,
        end: req.query.gst_status_from_date_end as string,
      },
      {
        field: "record_last_updated",
        start: req.query.record_last_updated_start as string,
        end: req.query.record_last_updated_end as string,
      },
    ];

    dateFilters.forEach(({ field, start, end }) => {
      if (start || end) {
        filter[field] = {};
        if (start) filter[field].$gte = new Date(start);
        if (end) filter[field].$lte = new Date(end);
      }
    });

    //Search (full-text + partial search)
    if (req.query.search) {
      const search = (req.query.search as string).trim().toLowerCase();

      //Partial search
      if (search.length <= 4) {
        filter.entity_name_normalized = {
          $gte: search,
          $lt: search + "\uffff",
        };
      }

      //Long search(text index)
      else {
        filter.$text = { $search: search };
      }
    }

    //Query execution
    const [results, total] = await Promise.all([
      ABN.find(filter)
        .sort({ record_last_updated: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      ABN.countDocuments(filter).exec(),
    ]);

    //Paginated response
    res.status(200).json({
      message: "ABNs retrieved successfully",
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Multi value filter helper function
const parseMultiValue = (value?: string | string[]) => {
  if (!value) return undefined;

  if (Array.isArray(value)) return value;

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};
