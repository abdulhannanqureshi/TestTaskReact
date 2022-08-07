import fs from 'fs';
import path from 'path';
var pdf = require('html-pdf');

const pdfCertificate = async (replaceObject: any, fileName: any) => {
  try {
    return new Promise((resolve, reject) => {
      let content = `${fs.readFileSync(
        path.join(__dirname, '..', 'app/emailtemplates/badgesCertificate.html'),
        'utf8'
      )}`;

      fileName = `${fileName}_${Date.now()}`;
      for (const key in replaceObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (replaceObject.hasOwnProperty(key)) {
          const val = replaceObject[key];
          if (typeof val === 'object') {
            // eslint-disable-next-line no-restricted-syntax
            for (const k in val) {
              // eslint-disable-next-line no-prototype-builtins
              if (val.hasOwnProperty(k)) {
                const v = val[k];
                content = content.replace(new RegExp(`{${key}.${k}}`, 'g'), v);
              }
            }
          } else {
            content = content.replace(new RegExp(`{${key}}`, 'g'), val);
          }
        }
      }
      // console.log(content);
      var options = {
        format: 'A4',
        orientation: 'portrait',
        header: {
          height: '0px',
        },
        border: '0px',
        footer: {
          height: '0px',
        },
      };

      pdf
        .create(content, options)
        .toFile(
          path.join(
            __dirname,
            '..',
            'app/public/uploads/certificates',
            `${fileName}.pdf`
          ),
          function (err: any, res: any) {
            if (err) return console.log(err);
            // console.log(res); // { filename: '/app/businesscard.pdf' }
            resolve(`uploads/certificates/${fileName}.pdf`);
            // return `certificates/${fileName}.pdf`;
          }
        );
      //   return content;
    });
  } catch (error) {
    console.log('error', error);
  }
};

export { pdfCertificate };
