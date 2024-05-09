const dayjs = require("dayjs");
const {db} = require("../../lib/firebase")
const { Filter } = require('firebase-admin/firestore');
const { connectRabbitMQ } = require('../../lib/rabbitmq');
const newNotification = async(data) => {
    try {
        const notificationToDB = {
            ...data,
            createdAt: dayjs().format(),
            read: false
        }
        const notification = await db.collection('notifications').add(notificationToDB);
        
        const channel = await connectRabbitMQ();
        await channel.sendToQueue('notifications', Buffer.from(JSON.stringify({ ...notificationToDB, id: notification.id })))
        return {
            status: 200,
            data: {
                data: notification?.id,
                success: true
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            data: {
                data: data?.id,
                success: false,
                error
            },
            error
        }
    }
} 

const readNotification = async(data) => {
    try {
        const notification = await db.collection('notifications').doc(data?.id).set({read: true}, {merge: true});        
        return {
            status: 200,
            data: {
                data: notification?.id,
                success: true
            }
        }
    } catch (error) {
        console.log('ha ocurrido un error');
        console.log(error);
        return {
            status: 400,
            data: {
                data: data?.id,
                success: false,
                error
            },
            error
        }
    }
}

const getUserNotifications = async(id) => {
    try {
        const querySnapshot = await db.collection('notifications').where(Filter.or(Filter.where('to', '==', id),Filter.where('to', '==', 'all' ))).orderBy('createdAt', 'desc').get()
        if (querySnapshot?.empty) {
            return {
                status: 200,
                data: {
                    data: id,
                    error: 'No hay notificaciones para este usuario',
                    success: false
                }
            }
        }
        let userNotifications = []
        querySnapshot.forEach(doc => {
            userNotifications.push({...doc.data(), id: doc.id})
        });
        return {
            status: 200,
            data: {
                data: userNotifications,
                success: true
            }
        }       
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    newNotification,
    readNotification,
    getUserNotifications
}