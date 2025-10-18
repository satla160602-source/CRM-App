import { Hono } from "hono";
import { cors } from "hono/cors";
import { CreateCustomerSchema, UpdateCustomerSchema } from "../shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Get all customers
app.get("/api/customers", async (c) => {
  try {
    const stmt = c.env.DB.prepare("SELECT * FROM customers ORDER BY name ASC");
    const { results } = await stmt.all();
    return c.json(results);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
});

// Get customer by ID
app.get("/api/customers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const stmt = c.env.DB.prepare("SELECT * FROM customers WHERE id = ?");
    const customer = await stmt.bind(id).first();
    
    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    return c.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return c.json({ error: "Failed to fetch customer" }, 500);
  }
});

// Create new customer
app.post("/api/customers", async (c) => {
  try {
    const body = await c.req.json();
    const customerData = CreateCustomerSchema.parse(body);
    
    const stmt = c.env.DB.prepare(`
      INSERT INTO customers (station_id, name, phone_number, address, latitude, longitude, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    const result = await stmt.bind(
      customerData.station_id,
      customerData.name,
      customerData.phone_number || null,
      customerData.address || null,
      customerData.latitude || null,
      customerData.longitude || null
    ).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to create customer" }, 500);
    }
    
    // Fetch the created customer
    const newCustomer = await c.env.DB.prepare("SELECT * FROM customers WHERE id = ?")
      .bind(result.meta.last_row_id).first();
    
    return c.json(newCustomer, 201);
  } catch (error) {
    console.error("Error creating customer:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return c.json({ error: "Invalid customer data", details: error.message }, 400);
    }
    return c.json({ error: "Failed to create customer" }, 500);
  }
});

// Update customer
app.put("/api/customers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const customerData = UpdateCustomerSchema.parse({ ...body, id });
    
    const stmt = c.env.DB.prepare(`
      UPDATE customers 
      SET station_id = ?, name = ?, phone_number = ?, address = ?, latitude = ?, longitude = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    const result = await stmt.bind(
      customerData.station_id,
      customerData.name,
      customerData.phone_number || null,
      customerData.address || null,
      customerData.latitude || null,
      customerData.longitude || null,
      id
    ).run();
    
    if (!result.success) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    // Fetch the updated customer
    const updatedCustomer = await c.env.DB.prepare("SELECT * FROM customers WHERE id = ?")
      .bind(id).first();
    
    return c.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return c.json({ error: "Invalid customer data", details: error.message }, 400);
    }
    return c.json({ error: "Failed to update customer" }, 500);
  }
});

// Delete customer
app.delete("/api/customers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const stmt = c.env.DB.prepare("DELETE FROM customers WHERE id = ?");
    const result = await stmt.bind(id).run();
    
    if (!result.success) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return c.json({ error: "Failed to delete customer" }, 500);
  }
});

export default app;
