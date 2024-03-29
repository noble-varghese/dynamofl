import httpx


class client():
    def __init__(self, base_url=None, headers=None) -> None:
        self.client = httpx.Client(base_url=base_url, headers=headers)

    def get(self, url, params=None, headers=None):
        try:
            response = self.client.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response

        except httpx.HTTPError as err:
            print(f'Error while requesting {err.request.url!r}')
            return None

    def post(self, url, params=None, headers=None):
        try:
            response = self.client.post(url, params=params, headers=headers)
            response.raise_for_status()
            return response

        except httpx.HTTPError as err:
            print(f'Error while requesting {err.request.url!r}')
            return None

    def is_closed(self):
        return self.client.is_closed

    def close(self):
        """Close the underlying HTTPX client.

        The client will *not* be usable after this.
        """
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(
        self,
        exc_type,
        exc,
        exc_tb
    ):
        self.close()
