import fs from 'fs';
import csv from 'csv-parser';

export const getShelterFromCSV = (req, res) => {
const shelters = [];
const { id } = req.params;

fs.createReadStream('goibibo_com-travel_sample.csv')
.pipe(csv())
.on('data', (row) => {
    if (row.uniq_id === id) {
    shelters.push({
        name: row.hotel_name,
        location: row.city,
        description: `Rating: ${row.rating}`,
        contact: {
        email: 'N/A',
        phone: 'N/A',
        },
        capacity: row.high_rate || 'Unknown',
        availability: true,
        mapUrl: `https://maps.google.com/?q=${encodeURIComponent(row.hotel_address || row.city)}`,
        photos: row.image_urls ? row.image_urls.split('|').slice(0, 5) : [],
    });
    }
})
.on('end', () => {
    if (shelters.length > 0) {
    res.json(shelters[0]);
    } else {
    res.status(404).json({ error: 'Shelter not found' });
    }
})
.on('error', (err) => {
    res.status(500).json({ error: 'Failed to read CSV' });
    });
};
