import Contacts from "./IContact";
import Organisations from "./IOrganisation";
import Tags from "./ITag";

export default interface IEvent {
  eventDate?: string;
  id?: string;
  name?: string;
  postCode?: string;
  venueName?: string;
  contacts?: Contacts[];
  organisations?: Organisations[];
  tags?: Tags[];
  contactCount?: number;
}
