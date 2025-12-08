import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles, User, Bot, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ParsedRFP } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useCreateRfp, useParseRfpInput } from "@/services/rfp.service";

const examplePrompts = [
  `I need to procure laptops and monitors for our new office.
Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15
monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty.`,
  `I need to procure 50 ergonomic office chairs and 10 standing desks for our new workspace. Budget is $35,000 total. Delivery required within 20 days. Chairs must support at least 120kg and have 3-year warranty. Payment terms: net 45.`,
  `We need to purchase networking equipment for our IT upgrade. Budget is $80,000. Requirements: 5 managed switches, 10 access points, 1 firewall appliance. Delivery within 15 days. Vendor must provide installation support and 1-year maintenance. Payment terms: 30% upfront, 70% on delivery.`,
];

export default function CreateRFP() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //STATES
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI assistant for creating RFPs. Describe what you need to procure, including details like quantities, specifications, budget, and timeline. I'll help structure it into a professional RFP.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [parsedRFP, setParsedRFP] = useState<ParsedRFP | null>(null);

  //MUTATION
  const { mutateAsync: parseUserInput, isPending: isParsingInputPending } =
    useParseRfpInput();
  const { mutateAsync: createRfp } = useCreateRfp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isParsingInputPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const res = await parseUserInput({ naturalLanguageText: inputValue });
    const parsed = res?.data?.data;
    setParsedRFP(parsed);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've analyzed your requirements and created a structured RFP. Here's what I understood:\n\n**${
        parsed.title
      }**\n\n• **Items:** ${parsed?.items
        .map((i) => `${i?.quantity ? i?.quantity : 0}x ${i?.name}`)
        .join(
          ", "
        )}\n• **Budget:** $${parsed.budget.toLocaleString()}\n• **Delivery:** ${new Date(
        parsed.deliveryDeadline
      ).toLocaleDateString()}\n• **Payment Terms:** ${
        parsed.paymentTerms
      }\n• **Warranty:** ${
        parsed.warrantyRequirement
      }\n\nWould you like to proceed with this RFP, or would you like to modify any details?`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleCreateRFP = async () => {
    try {
      const resp = await createRfp({ parsedRFP });
      toast({
        title: "RFP Created Successfully",
        description: resp?.data?.message,
      });
      navigate("/rfps");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Create RFP"
        description="Describe your procurement needs in natural language"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card shadow-sm">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      message.role === "assistant"
                        ? "gradient-ai"
                        : "bg-primary"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-accent-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%]",
                      message.role === "assistant"
                        ? "bg-secondary"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isParsingInputPending && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-ai">
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      <span className="text-sm text-muted-foreground">
                        Analyzing your requirements...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe what you need to procure..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isParsingInputPending || !inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Example Prompts */}
              {messages.length === 1 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Try an example:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValue(prompt)}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-left"
                      >
                        {prompt.slice(0, 50)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RFP Preview */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">RFP Preview</h3>
            </div>

            {parsedRFP ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Title
                  </p>
                  <p className="font-medium">{parsedRFP.title}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Items
                  </p>
                  <div className="space-y-2">
                    {parsedRFP.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm bg-secondary rounded-lg px-3 py-2"
                      >
                        <span>{item.name}</span>
                        <Badge variant="secondary">{item.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Budget
                    </p>
                    <p className="font-medium text-accent">
                      ${parsedRFP.budget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Delivery
                    </p>
                    <p className="font-medium">
                      {new Date(
                        parsedRFP.deliveryDeadline
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Payment
                    </p>
                    <p className="text-sm">{parsedRFP.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Warranty
                    </p>
                    <p className="text-sm">{parsedRFP.warrantyRequirement}</p>
                  </div>
                </div>

                <Button
                  onClick={handleCreateRFP}
                  className="w-full"
                  variant="accent"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Create RFP
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Start describing your procurement needs and I'll generate a
                  structured RFP for you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
