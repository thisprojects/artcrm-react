import IContact from "./IContact";
import IEvent from "./IEvent";
import IOrganisation from "./IOrganisation";
import ITag from "./ITag";

export default interface CRMDataModel
  extends IContact,
    IEvent,
    IOrganisation,
    ITag {
  delete?: boolean;
}
