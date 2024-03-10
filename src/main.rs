#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
#![allow(dead_code)]
#![allow(unused_imports)]
#![allow(unused_import_braces)]

#[macro_use] extern crate rocket;

use rocket::fs::{FileServer, NamedFile, relative};
use rocket::http::uri::Absolute;
use rocket::http::{uri::Path, Status, CookieJar};
use rocket::Request;
use rocket::response::{Response, Responder, Redirect, content::RawHtml};

const RAW_404: RawHtml<&'static str> = RawHtml(r#"
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>404 Not Found</title>
                    <style>
                        body, html {
                            height: 100%;
                            margin: 0;
                            font-family: Arial, sans-serif;
                        }
                        .container {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            text-align: center;
                        }
                        h1 {
                            font-size: 50px;
                            margin-bottom: 10px;
                        }
                        p {
                            font-size: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>404 Not Found</h1>
                        <p>Oops! The page you're looking for doesn't exist.</p>
                    </div>
                </body>
                </html>"#
            );


#[get("/")]
async fn index() -> Result<NamedFile, RawHtml<&'static str>> {
    NamedFile::open(std::path::Path::new("routes/index.html")).await.map_err(|_| RAW_404)
}

#[get("/db")]
async fn db() -> Result<NamedFile, RawHtml<&'static str>> {
    NamedFile::open(std::path::Path::new("routes/db.html")).await.map_err(|_| RAW_404)
}

#[get("/cock")]
async fn cock() -> &'static str {
    "cock"
}


#[get("/<n>")]
async fn dynamic(n: &str) -> String {
    format!("Sex: {}", n)
}

#[catch(404)]
fn not_found(_req: &Request) -> RawHtml<&'static str> {
    RAW_404
}



#[shuttle_runtime::main]
async fn rocket() -> shuttle_rocket::ShuttleRocket {
    let r = rocket::build()
            .mount("/", routes![index, db, cock])
            .mount("/user/", routes![dynamic])
            .mount("/css", FileServer::from(relative!("/css")))
            .mount("/js", FileServer::from(relative!("/js")))
            .register("/", catchers![not_found]);

    Ok(r.into())
}