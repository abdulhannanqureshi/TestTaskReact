/** @format */

import { SearchQueryModel } from "../../../models";
import { Messages } from "../../../common";
import { getBooks } from "../../../common/book";


/**
 * @api {get} /api/v1/book  Book - Book List
 * @apiName Book - Book List
 * @apiGroup Book
 * @apiPermission none
 * @apiDescription Search book
 * @apiParam {String} search Search keyword
 * @apiSuccess {String} search Search keyword
 */
const list = async (req, res) => {
  try {
    const { query, userId } = req;
    const { search } = query;
    await SearchQueryModel.create({
      searchKeyword: search,
      userId
    });
    const data = await getBooks(search);
    return res.status(200).json({
      message: Messages.List.replace(':item', 'Book'),
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export default {
  list,
};