import Contacts from "./IContact";
import Events from "./IEvent";
import Organisations from "./IOrganisation";
import Tags from "./ITag";

export default class Relationships {
  contacts?: Contacts[];
  events?: Events[];
  organisations?: Organisations[];
  tags?: Tags[];
}
