import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const createPurchase = async (artworkId, buyerData, artworkData) => {
  try {
    const purchasesRef = collection(db, 'purchases');
    const purchaseDoc = await addDoc(purchasesRef, {
      artworkId,
      artworkTitle: artworkData.title,
      artworkPrice: artworkData.price,
      artworkCurrency: artworkData.currency || 'INR',
      artistId: artworkData.artistId,
      buyerId: buyerData.userId,
      buyerName: buyerData.name,
      buyerEmail: buyerData.email,
      buyerPhone: buyerData.phone || '',
      buyerAddress: buyerData.address || '',
      status: 'pending', // pending, confirmed, shipped, delivered, cancelled
      paymentStatus: 'pending', // pending, paid, refunded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: buyerData.notes || ''
    });
    
    return { success: true, purchaseId: purchaseDoc.id };
  } catch (error) {
    console.error('Error creating purchase:', error);
    return { success: false, error: error.message };
  }
};

export const getUserPurchases = async (userId) => {
  try {
    const purchasesRef = collection(db, 'purchases');
    const q = query(
      purchasesRef, 
      where('buyerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const purchases = [];
    
    querySnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, purchases };
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return { success: false, error: error.message, purchases: [] };
  }
};

export const getArtistSales = async (artistId) => {
  try {
    const purchasesRef = collection(db, 'purchases');
    const q = query(
      purchasesRef, 
      where('artistId', '==', artistId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, sales };
  } catch (error) {
    console.error('Error fetching artist sales:', error);
    return { success: false, error: error.message, sales: [] };
  }
};

export const updatePurchaseStatus = async (purchaseId, status, paymentStatus = null) => {
  try {
    const purchaseRef = doc(db, 'purchases', purchaseId);
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    await updateDoc(purchaseRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating purchase status:', error);
    return { success: false, error: error.message };
  }
};
