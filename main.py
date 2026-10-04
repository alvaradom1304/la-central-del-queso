import os
import argparse
import glob
from rich.console import Console
from src.engines.analyzer import DiscoveryAnalyzer
from src.engines.research_analyzer import ResearchAnalyzer
from src.engines.strategy_analyzer import StrategyAnalyzer
from src.engines.brand_analyzer import BrandAnalyzer
from src.engines.digital_analyzer import DigitalAnalyzer
from src.engines.automation_analyzer import AutomationAnalyzer
from src.engines.growth_analyzer import GrowthAnalyzer
from src.engines.expansion_analyzer import ExpansionAnalyzer
from src.engines.case_analyzer import CaseAnalyzer
from pydantic import ValidationError
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader

# Load environment variables from .env file
load_dotenv()

console = Console()

def main():
    parser = argparse.ArgumentParser(description="Intelligence Engine CLI")
    parser.add_argument("--stage", type=str, choices=["discovery", "research", "strategy", "brand", "digital", "automation", "growth", "expansion", "case"], default="discovery", help="Which stage pipeline to run")
    parser.add_argument("--input", type=str, nargs='+', required=True, help="Path(s) to input file(s)")
    parser.add_argument("--output", type=str, help="Path to output markdown file")
    parser.add_argument("--mock", action="store_true", help="Use mock analyzer output instead of LLM")
    args = parser.parse_args()

    console.print(f"[bold blue]Initializing Intelligence Engine (Stage: {args.stage})...[/bold blue]")

    # Resolve glob patterns in input
    resolved_inputs = []
    for pattern in args.input:
        matched = glob.glob(pattern)
        if matched:
            resolved_inputs.extend(matched)
        else:
            resolved_inputs.append(pattern)

    try:
        if args.stage == "discovery":
            analyzer = DiscoveryAnalyzer()
        elif args.stage == "research":
            analyzer = ResearchAnalyzer()
        elif args.stage == "strategy":
            analyzer = StrategyAnalyzer()
        elif args.stage == "brand":
            analyzer = BrandAnalyzer()
        elif args.stage == "digital":
            analyzer = DigitalAnalyzer()
        elif args.stage == "automation":
            analyzer = AutomationAnalyzer()
        elif args.stage == "growth":
            analyzer = GrowthAnalyzer()
        elif args.stage == "expansion":
            analyzer = ExpansionAnalyzer()
        elif args.stage == "case":
            analyzer = CaseAnalyzer()
    except ValueError as ve:
        console.print(f"[bold red]Initialization Error:[/bold red] {ve}")
        return

    console.print(f"Reading raw input from [cyan]{', '.join(resolved_inputs)}[/cyan]")
    try:
        text = ""
        for filepath in resolved_inputs:
            with open(filepath, "r", encoding="utf-8") as f:
                text += f"\n\n--- CONTENT FROM {filepath} ---\n"
                text += f.read()
            
        console.print(f"Processing text via {analyzer.__class__.__name__}...")
        
        if args.mock and args.stage == "discovery":
            console.print("[yellow]Using mock extraction...[/yellow]")
            doc = analyzer.analyze_mock(text)
        else:
            doc = analyzer.analyze(text)

        console.print(f"\n[bold green]Successfully generated and validated the {args.stage.title()} Document![/bold green]")
        
        if args.output:
            # Render Markdown using Jinja2
            template_dir = os.path.join(os.path.dirname(__file__), "src", "templates")
            env = Environment(loader=FileSystemLoader(template_dir))
            
            if args.stage == "discovery":
                template = env.get_template("01_DISCOVERY_DOCUMENT.md")
                rendered_md = template.render(
                    company_overview=doc.company_overview,
                    business_model=doc.business_model,
                    operations=doc.operations,
                    value_proposition=doc.value_proposition,
                    pain_points=doc.pain_points,
                    fact_vs_hypothesis=doc.fact_vs_hypothesis,
                    information_gaps=doc.information_gaps
                )
            elif args.stage == "research":
                template = env.get_template("02_RESEARCH_REPORT.md")
                rendered_md = template.render(
                    market_overview=doc.market_overview,
                    competitor_analysis=doc.competitor_analysis,
                    pricing_benchmark=doc.pricing_benchmark,
                    consumer_trends=doc.consumer_trends,
                    strategic_opportunities=doc.strategic_opportunities
                )
            elif args.stage == "strategy":
                template = env.get_template("03_STRATEGY_REPORT.md")
                rendered_md = template.render(
                    positioning=doc.positioning,
                    target_customers=doc.target_customers,
                    product_strategy=doc.product_strategy,
                    channel_architecture=doc.channel_architecture,
                    roadmap=doc.roadmap,
                    kpis=doc.kpis
                )
            elif args.stage == "brand":
                template = env.get_template("04_BRAND_SYSTEM.md")
                rendered_md = template.render(
                    foundation=doc.foundation,
                    personality=doc.personality,
                    positioning=doc.positioning,
                    tone_of_voice=doc.tone_of_voice,
                    visual_system=doc.visual_system
                )
            elif args.stage == "digital":
                template = env.get_template("05_DIGITAL_ECOSYSTEM.md")
                rendered_md = template.render(
                    ecosystem_overview=doc.ecosystem_overview,
                    information_architecture=doc.information_architecture,
                    user_flows=doc.user_flows,
                    conversion_mechanisms=doc.conversion_mechanisms,
                    tech_stack=doc.tech_stack
                )
            elif args.stage == "automation":
                template = env.get_template("06_AI_AUTOMATION.md")
                rendered_md = template.render(
                    automation_matrix=doc.automation_matrix,
                    core_workflows=doc.core_workflows,
                    recommended_stack=doc.recommended_stack,
                    estimated_roi=doc.estimated_roi
                )
            elif args.stage == "growth":
                template = env.get_template("07_GROWTH_SYSTEM.md")
                rendered_md = template.render(
                    growth_funnel=doc.growth_funnel,
                    bundle_matrix=doc.bundle_matrix,
                    b2b_acquisition=doc.b2b_acquisition,
                    unit_economics=doc.unit_economics
                )
            elif args.stage == "expansion":
                template = env.get_template("10_CONTINUOUS_EXPANSION.md")
                rendered_md = template.render(
                    flywheel=doc.flywheel,
                    triggers=doc.triggers,
                    node_playbooks=doc.node_playbooks,
                    governance=doc.governance
                )
            elif args.stage == "case":
                template = env.get_template("12_MASTER_CASE_STUDY.md")
                rendered_md = template.render(
                    executive_summary=doc.executive_summary,
                    transformation_matrix=doc.transformation_matrix,
                    strategic_pillars=doc.strategic_pillars,
                    ai_impact=doc.ai_impact,
                    growth_projections=doc.growth_projections,
                    lessons_learned=doc.lessons_learned
                )
            
            os.makedirs(os.path.dirname(args.output), exist_ok=True)
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(rendered_md)
                
            console.print(f"\n[green]Saved rendered Markdown output to {args.output}[/green]")
        else:
            console.print("\n[bold yellow]Extracted Data Preview:[/bold yellow]")
            console.print(doc.model_dump_json(indent=2))

    except FileNotFoundError as e:
        console.print(f"[bold red]Error: File not found -> {e.filename}[/bold red]")
    except ValueError as ve:
        console.print(f"[bold red]Configuration/Validation Error:[/bold red] {ve}")
    except RuntimeError as re:
        console.print(f"[bold red]LLM Execution Error:[/bold red] {re}")
    except Exception as e:
        console.print(f"[bold red]Unexpected Error:[/bold red] {e}")

if __name__ == "__main__":
    main()
