/** @type{ import ("drizzle-kit").Config } */

export default {
    schema : "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials : {
        url : 'postgresql://mock%20interview%20db_owner:npg_P8SRnDerdz7j@ep-royal-math-a5i0eclp-pooler.us-east-2.aws.neon.tech/mock%20interview%20db?sslmode=require',
    }
}