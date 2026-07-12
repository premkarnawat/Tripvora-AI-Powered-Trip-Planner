import os
import re
import psycopg2

DB_URL = "postgresql://postgres:Tripvora.database1716#@db.gbmuacxsterrofwvvfow.supabase.co:5432/postgres"

def get_columns(table_name):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}';")
        cols = cur.fetchall()
        cur.close()
        conn.close()
        return cols
    except Exception as e:
        print(f"Error fetching schema for {table_name}: {e}")
        return []

def generate_zod_schema(columns):
    if not columns:
        return "z.object({})"
        
    zod_fields = []
    for col_name, data_type in columns:
        if col_name in ['id', 'created_at', 'updated_at']:
            continue
        
        if 'timestamp' in data_type:
            zod_type = "z.string().datetime().optional()"
        elif 'int' in data_type or 'numeric' in data_type:
            zod_type = "z.number().optional()"
        elif 'boolean' in data_type:
            zod_type = "z.boolean().optional()"
        elif 'json' in data_type:
            zod_type = "z.any().optional()"
        elif 'uuid' in data_type:
            zod_type = "z.string().uuid().optional()"
        else:
            zod_type = "z.string().optional()"
            
        zod_fields.append(f"  {col_name}: {zod_type},")
    
    schema_str = "z.object({\n" + "\n".join(zod_fields) + "\n})"
    return schema_str

api_dir = os.path.join("src", "app", "api", "admin")

skip_files = ['agencies', 'destinations', 'users']

for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file == "route.ts":
            path = os.path.join(root, file)
            # check if it's in the skip list
            skip = False
            for s in skip_files:
                if f"\\{s}\\" in path or f"/{s}/" in path:
                    skip = True
            
            if skip:
                print(f"Skipping custom file: {path}")
                continue
                
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Find the table name
            match = re.search(r"supabase\.from\('([^']+)'\)", content)
            if not match:
                continue
            table_name = match.group(1)
            
            print(f"Refactoring {path} (Table: {table_name})")
            columns = get_columns(table_name)
                
            zod_schema_str = generate_zod_schema(columns)
            
            new_content = f'''import {{ NextResponse }} from 'next/server';
import {{ createClient }} from '@/lib/supabase/server';
import {{ withSecurity }} from '@/lib/security/api-wrapper';
import {{ z }} from 'zod';

const schema = {zod_schema_str};

export const GET = withSecurity({{
  requireRoles: ['admin', 'super_admin']
}}, async (request: Request) => {{
  try {{
    const supabase = await createClient();
    const {{ searchParams }} = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {{
        const {{ data }} = await supabase.from('{table_name}').select('*').eq('id', id).single();
        return NextResponse.json(data || {{}});
    }}

    const {{ data }} = await supabase.from('{table_name}').select('*').order('created_at', {{ ascending: false }}).limit(100);
    return NextResponse.json(data || [], {{ headers: {{ 'Cache-Control': 'private, max-age=30' }} }});
  }} catch (err: any) {{ 
    return NextResponse.json({{ error: err.message }}, {{ status: 500 }}); 
  }}
}});

export const POST = withSecurity({{
  requireRoles: ['admin', 'super_admin'],
  schema: schema
}}, async (request: Request) => {{
  try {{
    const supabase = await createClient();
    const body = await request.json();
    const validatedData = schema.parse(body); // Zod strips unknown fields!
    
    const {{ data, error }} = await supabase.from('{table_name}').insert(validatedData).select().single();
    if (error) throw error;
    return NextResponse.json({{ success: true, data }});
  }} catch (err: any) {{ 
    return NextResponse.json({{ error: err.message }}, {{ status: 500 }}); 
  }}
}});

export const PUT = withSecurity({{
  requireRoles: ['admin', 'super_admin']
}}, async (request: Request) => {{
  try {{
    const supabase = await createClient();
    const body = await request.json();
    const {{ id, ...updates }} = body;
    if (!id) return NextResponse.json({{ error: 'Missing ID' }}, {{ status: 400 }});
    
    const validatedUpdates = schema.parse(updates); // Zod strips unknown fields!
    
    const {{ data, error }} = await supabase.from('{table_name}').update(validatedUpdates).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({{ success: true, data }});
  }} catch (err: any) {{ 
    return NextResponse.json({{ error: err.message }}, {{ status: 500 }}); 
  }}
}});

export const DELETE = withSecurity({{
  requireRoles: ['admin', 'super_admin']
}}, async (request: Request) => {{
  try {{
    const supabase = await createClient();
    const {{ searchParams }} = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({{ error: 'Missing ID' }}, {{ status: 400 }});

    const {{ error }} = await supabase.from('{table_name}').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({{ success: true }});
  }} catch (err: any) {{ 
    return NextResponse.json({{ error: err.message }}, {{ status: 500 }}); 
  }}
}});
'''
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  -> Successfully refactored {path}")

