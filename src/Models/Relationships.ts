import Contacts from "./IContact";
import Events from "./IEvent";
import Organisations from "./IOrganisation";
import Tags from "./ITag";

export default interface Relationships {
  contacts?: Contacts[];
  events?: Events[];
  organisations?: Organisations[];
  tags?: Tags[];
}
