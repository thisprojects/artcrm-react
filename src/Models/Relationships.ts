import Contacts from "./Contacts";
import Events from "./Events";
import Organisations from "./Organisations";
import Tags from "./Tags";

export default class Relationships {
  contacts?: Contacts[];
  events?: Events[];
  organisations?: Organisations[];
  tags?: Tags[];
}
