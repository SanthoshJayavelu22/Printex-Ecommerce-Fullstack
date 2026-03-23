import { Model, Document, Query } from 'mongoose';
import { AdvancedResultsResponse } from '../types/api';

/**
 * Utility to handle advanced mongoose queries including filtering, sorting, selecting, and pagination.
 * @param model Mongoose Model
 * @param reqQuery The request query (req.query)
 * @param populate Path or object to populate
 */
const advancedResults = async <T = any>(
    model: any,
    reqQuery: any,
    populate?: any
): Promise<AdvancedResultsResponse<T>> => {
    let query: any;

    // Copy req.query
    const reqQueryCopy = { ...reqQuery };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];

    // Loop over removeFields and delete them from reqQueryCopy
    removeFields.forEach(param => delete reqQueryCopy[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQueryCopy);

    // Create operators ($gt, $gte, etc)
    // Only prepend $ if it is not already there
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match, offset, fullStr) => {
        return fullStr[offset - 1] === '$' ? match : `$${match}`;
    });

    // Initial Query object
    let queryObj = JSON.parse(queryStr);
    console.log('ADVANCED RESULTS QUERY OBJ:', JSON.stringify(queryObj, null, 2));

    // Keyword search (if keyword exists)
    if (reqQuery.keyword) {
        queryObj.name = { $regex: reqQuery.keyword, $options: 'i' };
    }

    // Finding resource
    query = model.find(queryObj);

    // Select Fields
    if (reqQuery.select) {
        const fields = reqQuery.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (reqQuery.sort) {
        const sortBy = reqQuery.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(reqQuery.page, 10) || 1;
    const limit = parseInt(reqQuery.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Executing query
    const results = await query.lean();

    // Pagination result
    const pagination: any = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    return {
        success: true,
        count: results.length,
        total,
        pagination,
        data: results as unknown as T[]
    };
};

export default advancedResults;
