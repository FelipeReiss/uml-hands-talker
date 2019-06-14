import { AngularFirestoreCollection, AngularFirestore, QueryFn, AngularFirestoreDocument } from 'node_modules/@angular/fire/firestore';
import { Observable } from 'node_modules/rxjs';

export abstract class Firestore<W extends { id: string }> {

    protected collection: AngularFirestoreCollection<W>;

    constructor(protected db: AngularFirestore) {}

    protected setCollection(path: string, queryFn?: QueryFn): void {
        this.collection = path ? this.db.collection(path, queryFn) : null;
    }

    private setItem(item: W, operation: string): Promise<W> {
        return this.collection
            .doc<W>(item.id)
            [operation](item)
            .then(() => item);
    }

    getAll(): Observable<W[]> {
        return this.collection.valueChanges();
    }

    get(id: string): Observable<W> {
        return this.collection.doc<W>(id).valueChanges();
    }

    create(item: W): Promise<W> {
        if (!item.id) {
            item.id = this.db.createId();
        }
        return this.setItem(item, 'set');
    }

    update(item: W): Promise<W> {
        return this.setItem(item, 'update');
    }

    delete(item: W): Promise<void> {
        return this.collection.doc<W>(item.id).delete();
    }

    search(item: W, collection: string) {
         return this.db.collection(collection, ref => {
             return ref.where('id', '==', item.id);
         }).valueChanges();
    }

    searchArray(collection: string, field: string, filter: string) {
        return this.db.collection(collection, ref => {
            return ref.where(field, 'array-contains', filter);
        }).valueChanges();
    }
}
