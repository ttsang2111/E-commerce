const cloudinary = require('cloudinary').v2;
const config = require('../configs')('cloudinary');

cloudinary.config(config);

console.log('Cloudinary config', cloudinary.config());

class CloudinaryService {
    static upload = async () => {
        try {
            return await cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
            { public_id: "olympic_flag", folder: 'sample/flag' },
            function (error, result) { console.log(result); });
        } catch (err) {
            console.error(err);
        }
        
    }
}

module.exports = CloudinaryService;

