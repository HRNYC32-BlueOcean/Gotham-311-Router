
// Every key represents a subdomain (eg: http://api.example.com). 
// When a user tries to access this website they are routed to the 
// correct service based on what subdomain is in the request.
//
// 'DEFAULT' is used as a fallback when a user doesn't provide a
// subdomain (eg: http://example.com ) and is required for most
// routes.
// 
// The actual values are stored in arrays. This is so that the server
// can forward requests via the round-robin method to multiple service
// instances if required later!
const paths = {
    DEFAULT: [ 'localhost:8000' ],
    api: {
        DEFAULT: [ 'localhost:5500' ]
    },
    employee: {
        DEFAULT: [ 'localhost:8080' ]
    }
}