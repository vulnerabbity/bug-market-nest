import { IEntityWithId } from "../interface/entities.interface"
import { MongooseService } from "./mongoose.service"
import { Action } from "../../auth/authorization/abilities/casl-ability.factory"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"
import { Inject } from "@nestjs/common"
import { CaslAbilityFactory, Subjects } from "src/auth/authorization/abilities/casl-ability.factory"
import { Model, Document } from "mongoose"
import { InvalidPermissionsException } from "../exceptions/authorization.exception"

type CaslSubjectWithId = IEntityWithId & Subjects

export interface PermissionValidatorForActionInput<T> {
  action: Action
  subject: T
  requester: RolesOwner
}

export type PermissionValidatorInput<T> = Omit<PermissionValidatorForActionInput<T>, "action">

export abstract class MongooseCaslService<T extends CaslSubjectWithId> extends MongooseService<T> {
  @Inject()
  private abilitiesFactory!: CaslAbilityFactory
  constructor(documentModel: Model<T & Document>) {
    super(documentModel)
  }

  public failIfManageForbidden(input: PermissionValidatorInput<T>) {
    return this.failIfActionForbidden({ action: "manage", ...input })
  }

  public failIfCreatingForbidden(input: PermissionValidatorInput<T>) {
    return this.failIfActionForbidden({ action: "create", ...input })
  }

  public failIfUpdatingForbidden(input: PermissionValidatorInput<T>) {
    return this.failIfActionForbidden({ action: "update", ...input })
  }

  public failIfDeletingForbidden(input: PermissionValidatorInput<T>) {
    return this.failIfActionForbidden({ action: "delete", ...input })
  }

  public failIfReadingForbidden(input: PermissionValidatorInput<T>) {
    return this.failIfActionForbidden({ action: "delete", ...input })
  }

  private failIfActionForbidden({
    action,
    requester,
    subject
  }: PermissionValidatorForActionInput<T>) {
    const requesterAbilities = this.abilitiesFactory.createForRolesOwner(requester)
    const isPermitted = requesterAbilities.can(action, subject)

    if (isPermitted) {
      return
    }

    throw new InvalidPermissionsException()
  }
}
