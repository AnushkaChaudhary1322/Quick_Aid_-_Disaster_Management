import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const csvFilePath = path.join(process.cwd(), 'data', 'shelterCSV.csv');

export const loadSheltersFromCSV = () => {
  return new Promise((resolve, reject) => {
    const shelters = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const name = row['property_name'];
          const location = row['city'];
          const description = row['hotel_description'];
          const contactEmail = `${row['property_name'].replace(/\s+/g, '').toLowerCase()}@gmail.com`;
          const contactPhone = '9876543210';
          const capacity = parseInt(row['room_count']) * 10 || 0;
          const availability = 'available';
          const address = row['address'];
          const image = 'https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg'; 
          const accessId = row['uniq_id']; 

          shelters.push({
            name,
            location,
            description,
            contact: {
              email: contactEmail,
              phone: contactPhone,
            },
            capacity,
            availability,
            address,
            photos: [image],
            accessId,
          });
        } catch (err) {
          // Skip problematic row
          console.error('Error parsing row:', err);
        }
      })
      .on('end', () => {
        resolve(shelters);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
