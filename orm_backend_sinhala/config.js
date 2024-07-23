// module.exports = {
//     development:{
//         username:'root',
//         password:'rootNu@123',
//         database:'sinhala_inventory',
//         host:'localhost',
//         dialect:'mysql'
//     },
//     dialectOptions: {
//         charset: 'utf8mb4',
//         collate: 'utf8mb4_unicode_ci',
//         useUTC: false, // For reading from database
//         dateStrings: true,
//         typeCast: function (field, next) { // For reading from database
//             if (field.type === 'DATETIME') {
//                 return field.string();
//             }
//             return next();
//         },
//     },
// };

module.exports = {
    development: {
      username: 'root',
      password: 'rootNu@123',
      database: 'sinhala_inventory',
      host: 'localhost',
      dialect: 'mysql', // Fix the typo here
      dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: function (field, next) {
          if (field.type === 'DATETIME') {
            return field.string();
          }
          return next();
        },
      },
      timezone: '+00:00', // For writing to database
    },
  };
  