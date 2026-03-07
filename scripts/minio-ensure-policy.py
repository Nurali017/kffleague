#!/usr/bin/env python3
"""Ensure MinIO bucket policy includes all required public prefixes.

Usage:
  python3 scripts/minio-ensure-policy.py [endpoint] [access_key] [secret_key] [bucket]

Defaults read from env: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
"""

import json
import os
import sys
import urllib.request
import urllib.error
import hashlib
import hmac
import datetime

REQUIRED_PREFIXES = [
    "broadcaster_logos/*",
    "coach_photos/*",
    "document/*",
    "leadership/*",
    "news/*",
    "news_content/*",
    "news_image/*",
    "player_photos/*",
    "protocol_pdfs/*",
    "public/*",
    "sponsors/*",
    "uploads/*",
]


def main():
    endpoint = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MINIO_ENDPOINT", "127.0.0.1:9000")
    access_key = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("MINIO_ACCESS_KEY", "")
    secret_key = sys.argv[3] if len(sys.argv) > 3 else os.environ.get("MINIO_SECRET_KEY", "")
    bucket = sys.argv[4] if len(sys.argv) > 4 else os.environ.get("MINIO_BUCKET", "qfl-files")

    if not access_key or not secret_key:
        print("ERROR: MINIO_ACCESS_KEY and MINIO_SECRET_KEY required")
        sys.exit(1)

    try:
        from minio import Minio

        client = Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=False)

        # Get current policy
        try:
            policy = json.loads(client.get_bucket_policy(bucket))
        except Exception:
            policy = {"Version": "2012-10-17", "Statement": []}

        # Find or create the public read statement
        statement = None
        for s in policy.get("Statement", []):
            if s.get("Effect") == "Allow" and "s3:GetObject" in s.get("Action", []):
                statement = s
                break

        if statement is None:
            statement = {
                "Effect": "Allow",
                "Principal": {"AWS": ["*"]},
                "Action": ["s3:GetObject"],
                "Resource": [],
            }
            policy["Statement"].append(statement)

        resources = statement.setdefault("Resource", [])
        added = []
        for prefix in REQUIRED_PREFIXES:
            arn = f"arn:aws:s3:::{bucket}/{prefix}"
            if arn not in resources:
                resources.append(arn)
                added.append(prefix)

        if added:
            client.set_bucket_policy(bucket, json.dumps(policy))
            print(f"Added {len(added)} prefix(es): {', '.join(added)}")
        else:
            print("Policy already up to date")

    except ImportError:
        print("ERROR: minio package not found. Install with: pip install minio")
        sys.exit(1)


if __name__ == "__main__":
    main()
