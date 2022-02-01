import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import { User } from '../../../../models/user.model'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import DocumentReference = firestore.DocumentReference
import WriteResult = firestore.WriteResult
import { UserSettings } from '../../../../models/settings/user-settings.model'

export class UserDb {
  private collectionName = 'users'
  private userQuery: DocumentReference
  private userDoc?: DocumentSnapshot

  private settingsDoc?: DocumentSnapshot

  constructor(
    private userId: string
  ) {
    this.userQuery = admin.firestore()
      .collection(this.collectionName)
      .doc(this.userId)
  }

  get userData(): User | never {
    if (!this.userDoc) {
      throw new Error('User are not fetched run user.fetchUser()')
    }

    return {
      ...this.userDoc.data() as Omit<User, 'id'>,
      id: this.userDoc.id
    }
  }

  public async fetchUser(): Promise<User> {
    this.userDoc = await this.userQuery.get()
    return this.userData
  }

  public async incrementCounter(counter: keyof User['counters'], value: number): Promise<WriteResult> {
    return this.userQuery
      .set(
        { counters: { tasks: admin.firestore.FieldValue.increment(value) } },
        { merge: true }
      )
  }

  get settingsData(): UserSettings | never {
    if (!this.settingsDoc) {
      throw new Error('Settings are not fetched run user.fetchUserSettings()')
    }

    return {
      ...this.settingsDoc.data() as Omit<UserSettings, 'id'>,
      id: this.settingsDoc.id
    }
  }

  public async fetchUserSettings(): Promise<UserSettings> {
    const settingsRef = admin.firestore()
      .collectionGroup('settings')
      .where('ownerId', '==', this.userId)

    const collRef = await settingsRef.get()
    this.settingsDoc = collRef.docs[0]

    return this.settingsData
  }
}
