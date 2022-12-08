import { setupServer} from "msw/node";
import { rest } from "msw";
import {contacts} from "../API-Mocks/contacts";

export const serverFactory = ({collection, single, section}) => {

  let mutatedCollection = collection
  let mutatedSingleItem = single 
  
  return setupServer(
    rest.get(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/${section}/getAll`,
      (req, res, ctx) => {
        // respond using a mocked JSON body
        return res(ctx.json(mutatedCollection));
      }
    ),
    rest.get(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/${section}/getSingle/${mutatedSingleItem.id}`,
      (req, res, ctx) => {
        // respond using a mocked JSON body
        return res(ctx.json(mutatedSingleItem));
      }
    ),
    rest.get(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/tag/getAll`,
      (req, res, ctx) => {
        return res(ctx.json([{ id: "1234-4543-2345", name: "a tag" }]));
      }
    ),
    rest.delete(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/${section}/deleteMulti/`,
      (req, res, ctx) => {
        const deletedIds = req?.body

        mutatedCollection = mutatedCollection.filter(
          (item) => !deletedIds?.includes(item.id)
        );
        return res(ctx.json({ success: true }));
      }
    ),
    rest.put(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/${section}/updatejson/${mutatedSingleItem.id}`,
      (req, res, ctx) => {
        mutatedCollection = mutatedCollection.filter(
          (item) => item.id !== req.body.id
        );
        mutatedCollection.push(req?.body);
        mutatedSingleItem = req?.body;
        return res(ctx.json(mutatedCollection));
      }
    ),
    rest.get(
      `http://${
        process.env.REACT_APP_HOSTNAME || "localhost"
      }:8080/api/v1/contact/getAll`,
      (req, res, ctx) => {
        // respond using a mocked JSON body
        return res(ctx.json(contacts));
      }
    ),
  );
};
