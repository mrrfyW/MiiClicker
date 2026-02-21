#!/usr/bin/env python3
"""
Usage:
    python3 server.py
    python3 server.py 8080    # custom port
"""

import sys
import os
import http.server

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        if args[1] not in ('200', '304'):
            super().log_message(format, *args)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"")
print(f"  Local server started.")
print(f"  ─────────────────────────────")
print(f"  To view it, open this in your browser: http://localhost:{PORT}")
print(f"  Press Ctrl+C to stop, or end the Python executable task in Task Manager.")
print(f"")

with http.server.HTTPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
