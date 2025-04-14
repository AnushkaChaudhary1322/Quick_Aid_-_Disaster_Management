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
        // Extract and transform necessary fields
        const name = row['property_name'];
        const location = row['city'];
        const description = row['hotel_description'];
        const contactEmail = `${row['property_name'].replace(/\s+/g, '').toLowerCase()}@gmail.com`;
        const contactPhone = '1234567890'; // default as no phone info in CSV
        const capacity = parseInt(row['room_count']) * 5 || 0;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['address'])}`;
        const accessId = row['uniq_id'];
        const photos = ['https://via.placeholder.com/300']; // default photo

        // Add formatted shelter data to the list
        shelters.push({
          name,
          location,
          description,
          contact: {
            email: contactEmail,
            phone: contactPhone,
          },
          capacity,
          availability: true,
          mapUrl,
          photos,
          accessId,
        });
      })
      .on('end', () => {
        resolve(shelters);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
