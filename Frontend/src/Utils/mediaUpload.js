import { createClient } from '@supabase/supabase-js';

const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbXNpdW9qZWx3Z3JleXJkaGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzM4MzAsImV4cCI6MjA5NDY0OTgzMH0.8FdySLpHUt4XifOIXQL9oPv5Uy2U6uw6q8dAZ-90Omc";
const url = "https://iqmsiuojelwgreyrdhkg.supabase.co"

const supabase = createClient(url, key)


export default function uploadmedia(file) {
    return new Promise((resolve, reject) => {
        if (file) {
            const fileName = new Date().getTime() + '-' + file.name

            supabase.storage.from('images').upload(fileName, file)
                .then(() => {
                    const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl
                    resolve(publicUrl)
                })
                .catch((error) => {
                    console.error('Error uploading file:', error)
                    reject(error)
                })
        } else {
            reject(new Error('No file selected'))
        }
    })
}