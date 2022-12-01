import Contact from "./IContact";
import Events from "./IEvent";
import Tags from "./ITag";

export default interface IOrganisation {
  email?: string;
  id?: string;
  name?: string;
  postCode?: string;
  contacts?: Array<Contact>;
  events?: Array<Events>;
  tags?: Array<Tags>;
}
