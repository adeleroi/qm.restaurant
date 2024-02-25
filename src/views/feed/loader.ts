import { getDocs } from "firebase/firestore";
import { json } from "react-router-dom";
import { Store } from ".";
import { storeCollection } from "../../firebase/fireStore";

export async function Feedloader() {
    const stores: Array<Store> = [];
    const snapshot = await getDocs(storeCollection);
    snapshot.forEach(doc => {
        stores.push({id: doc.id, ...doc.data()} as Store)
    })
    return json({stores})
}
