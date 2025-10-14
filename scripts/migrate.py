import os
from supabase import create_client, Client
import json

# Supabase Configuration
SUPABASE_URL ="https://utqpkukuvsecwgnsprfs.supabase.co"
SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdWhuem96ZXB3anJtd2x0anB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTg4NzgsImV4cCI6MjA3NTc5NDg3OH0.Rr3iPsaBRLynh6uvJAtyafYgxiFbUSzQeTAIlG5uIbs" 

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

async def fetch_all_data(table_name: str):
    response = supabase.table(table_name).select("*").execute()
    if response.data:
        return response.data
    else:
        print(f"Error fetching {table_name}: {response.error}")
        return []

async def export_data_to_json():
    print("Exporting categories...")
    categories = await fetch_all_data("categories")
    with open("categories.json", "w") as f:
        json.dump(categories, f, indent=2)
    print("Categories exported to categories.json")

    print("Exporting subcategories...")
    subcategories = await fetch_all_data("subcategories")
    with open("subcategories.json", "w") as f:
        json.dump(subcategories, f, indent=2)
    print("Subcategories exported to subcategories.json")

    print("Exporting products...")
    products = await fetch_all_data("products")
    with open("products.json", "w") as f:
        json.dump(products, f, indent=2)
    print("Products exported to products.json")

    print("Exporting orders...")
    orders = await fetch_all_data("orders")
    with open("orders.json", "w") as f:
        json.dump(orders, f, indent=2)
    print("Orders exported to orders.json")

    print("Exporting order_items...")
    order_items = await fetch_all_data("order_items")
    with open("order_items.json", "w") as f:
        json.dump(order_items, f, indent=2)
    print("Order items exported to order_items.json")

async def main():
    await export_data_to_json()
    print("Export complete!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
