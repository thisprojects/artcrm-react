import Contact from "./Contacts";
import Events from "./Events";
import Tags from "./Tags";

export default class Organisations {
  constructor(
    private email: string,
    private id: string,
    private name: string,
    private postCode: string,
    private contacts?: Array<Contact>,
    private events?: Array<Events>,
    private tags?: Array<Tags>
  ) {}
}
