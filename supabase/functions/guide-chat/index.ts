import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guideId, message, conversationId } = await req.json();
    
    console.log("Guide chat request:", { guideId, messageLength: message?.length, conversationId });

    if (!guideId || !message) {
      return new Response(
        JSON.stringify({ error: "guideId and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch guide configuration
    const { data: guide, error: guideError } = await supabase
      .from("spiritual_guides")
      .select("*")
      .eq("id", guideId)
      .eq("is_active", true)
      .single();

    if (guideError || !guide) {
      console.error("Guide not found:", guideError);
      return new Response(
        JSON.stringify({ error: "Guide not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found guide:", guide.name);

    // Get or create conversation
    let activeConversationId = conversationId;
    
    if (!activeConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("guide_conversations")
        .insert({
          user_id: user.id,
          guide_id: guideId,
          title: `Conversa com ${guide.name}`,
        })
        .select()
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return new Response(
          JSON.stringify({ error: "Failed to create conversation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      activeConversationId = newConversation.id;
      console.log("Created new conversation:", activeConversationId);
    }

    // Fetch conversation history (last 20 messages)
    const { data: history, error: historyError } = await supabase
      .from("guide_messages")
      .select("role, content")
      .eq("conversation_id", activeConversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    if (historyError) {
      console.error("Error fetching history:", historyError);
    }

    console.log("Fetched history:", history?.length || 0, "messages");

    // Save user message
    const { error: saveUserError } = await supabase
      .from("guide_messages")
      .insert({
        conversation_id: activeConversationId,
        role: "user",
        content: message,
      });

    if (saveUserError) {
      console.error("Error saving user message:", saveUserError);
    }

    // Build messages array for AI
    const systemPrompt = `${guide.system_prompt}

REGRAS CRÍTICAS DE SEGURANÇA:
1. NUNCA forneça diagnósticos médicos ou psicológicos
2. NUNCA recomende interromper tratamentos médicos
3. Sempre sugira buscar ajuda profissional quando apropriado
4. Mantenha um tom positivo, acolhedor e encorajador
5. Redirecione conversas inapropriadas gentilmente
6. Não faça promessas ou previsões definitivas
7. Foque em bem-estar, autoconhecimento e práticas saudáveis
8. Responda sempre em português brasileiro

Seu nome é ${guide.name} e sua abordagem é ${guide.approach}.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI Gateway...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a transform stream to collect the full response for saving
    let fullResponse = "";
    
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        
        // Parse SSE data to extract content
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
        
        controller.enqueue(chunk);
      },
      async flush() {
        // Save assistant message after stream ends
        if (fullResponse) {
          console.log("Saving assistant response:", fullResponse.length, "chars");
          
          const { error: saveError } = await supabase
            .from("guide_messages")
            .insert({
              conversation_id: activeConversationId,
              role: "assistant",
              content: fullResponse,
            });

          if (saveError) {
            console.error("Error saving assistant message:", saveError);
          }
        }
      },
    });

    const responseStream = aiResponse.body?.pipeThrough(transformStream);

    return new Response(responseStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": activeConversationId,
      },
    });
  } catch (error) {
    console.error("Guide chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
