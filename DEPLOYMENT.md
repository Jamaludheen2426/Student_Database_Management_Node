# Vercel Deployment Guide

## Environment Variables Required in Vercel

Set these environment variables in your Vercel project settings:

```
DB_HOST=hf9k17.h.filess.io
DB_USER=Student_entermotor
DB_PASS=5197eafbfd9d535cb11036c369004e37a4242783
DB_NAME=Student_entermotor
DB_PORT=61032
DB_DIALECT=mysql
NODE_ENV=production
```

## API Endpoints

- **Health Check**: `GET /`
- **Student Info**: `GET /student`
- **Get All Students**: `GET /students`
- **Add Student**: `POST /students`
- **Update Student**: `PUT /students/:id`
- **Delete Student**: `DELETE /students/:id`
- **Delete All Students**: `DELETE /students`

## CORS Configuration

The API is configured to accept requests from:
- All `.vercel.app` domains
- Localhost (development)
- Specific production domains

## Troubleshooting

1. Check Vercel function logs for detailed error messages
2. Ensure all environment variables are set correctly
3. Verify database connection credentials
4. Test individual endpoints using the health check first