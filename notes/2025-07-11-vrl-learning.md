# From Homegrown Agent to Claude Code: Evolving an Agentic Framework for VRL Transformation Generation

## Introduction: The Log Transformation Challenge

In the world of cybersecurity, log data arrives in countless formats—from AWS CloudTrail events to Cisco ASA firewall logs, from Okta authentication records to custom application logs. Making sense of this heterogeneous data requires normalizing it to a common schema. Enter the Open Cybersecurity Schema Framework (OCSF), a unified schema that allows security tools to speak a common language.

But how do you transform logs from their native formats to OCSF? This is where Vector Remap Language (VRL) comes in—a domain-specific language designed for transforming structured log data. VRL allows you to write declarative transformations that map fields, parse timestamps, extract nested data, and handle edge cases.

The challenge is that writing VRL transformations manually is tedious and error-prone. Each sourcetype requires understanding both its native format and the OCSF schema, then crafting transformations that preserve data integrity while conforming to schema requirements. This is a perfect candidate for automation through AI agents.

## The Evolution: From Homegrown to Claude Code

I initially built a custom agent system (`learn_vrl_transformations_with_agent.py`) that used tool-based interactions to generate VRL transformations. While functional, it required significant engineering effort to handle context management, conversation flow, and iteration logic. Then I discovered Claude Code could serve as a general-purpose agentic backbone, leading to a cleaner implementation (`learn_vrl_transformation_with_coding_agent.py`).

Let's explore both approaches and the lessons learned from this evolution.

## The Homegrown Agent: A Tool-Based Approach

### Architecture and Design

The homegrown agent operates through a structured tool interface with three main tools:

1. **`think`**: Allows the agent to plan and reason about the transformation approach
2. **`query_ocsf_schema`**: Enables exploration of OCSF schema details for proper field mapping
3. **`submit_code_tool`**: Submits VRL transformations for validation and testing

The agent follows a conversation-based approach where each interaction must use one of these tools. This creates a highly structured but somewhat rigid interaction pattern.

### Key Components

```python
async def run_agentic_vrl_generation_loop(
    native_logs: List[Dict[str, Any]],
    output_dir: Path,
    vrl_guide: str,
    example_transformations: str,
    vrl_generation_model: str,
    max_turns: int,
    logger: logging.Logger,
) -> VRLGenerationResult:
```

The main loop orchestrates:
- **Pre-classification**: Uses an LLM to classify logs and suggest OCSF event classes
- **Message management**: Tracks conversation history with automatic summarization
- **Tool execution**: Processes agent tool calls and validates usage
- **Validation feedback**: Runs comprehensive tests on submitted transformations

### Context Management Challenges

One of the biggest challenges was managing context within token limits. The agent implements automatic conversation summarization:

```python
# When conversations exceed 8 messages:
# - Keep first 1 message and last 3 messages  
# - Summarize middle messages to reduce tokens
```

This works but requires careful tuning and can lose important details in the summarization process.

## The Claude Code Approach: File-Based Agentic Framework

### A Different Paradigm

Claude Code takes a fundamentally different approach. Instead of tool-based interactions, it operates on a file system with a well-structured working directory:

```
working_directory/
├── logs/
│   ├── native.json
│   └── native_ocsf_pairs.json
├── documentation/
│   ├── VRL_LLM_Reference.md
│   └── ocsf_schema_summary.md
├── vrl_example_*/
│   ├── native_to_ocsf.vrl
│   └── ocsf_to_native.vrl
├── vrl_to_write/
│   ├── native_to_ocsf.vrl
│   └── ocsf_to_native.vrl
├── test_vrl_transformations.sh
└── claude_thoughts.md
```

### The Power of Test-Driven Development

The Claude Code implementation leverages a test script (`test_vrl_transformations.sh`) that serves as the exit criteria for the loop:

```python
success = await run_claude_code_with_tests(
    prompt=prompt,
    working_dir=str(working_dir),
    editable_files=editable_files,
    context_files=context_files,
    test_command="./test_vrl_transformations.sh",
    max_turns=max_turns,
    logger=logger,
)
```

This creates a natural feedback loop where:
1. Claude Code generates or modifies VRL transformations
2. The test script validates the transformations
3. Test results guide the next iteration
4. The loop continues until tests pass or max turns are reached

### Observability Through the File System

A clever trick in the Claude Code approach is using the test script to snapshot transformations along with test results:

```bash
# In test_vrl_transformations.sh
cp vrl_to_write/*.vrl test_results/snapshot/
echo "Test passed/failed" > test_results/status.txt
```

This provides excellent observability—you can see exactly what was generated at each iteration and why it failed or succeeded.

## The Optimization Nature of the Problem

Both approaches tackle what is fundamentally an optimization problem:

**Objective**: Find VRL transformations that satisfy multiple criteria:
- Correctly map native fields to OCSF schema
- Maintain round-trip consistency (native→OCSF→native)
- Preserve important data without hiding it in `raw_data`
- Follow VRL best practices and idioms

**Constraints**:
- Must be valid VRL syntax
- Must conform to OCSF schema requirements
- Must handle edge cases and null values

The agent doesn't know the exact solution—it must explore the solution space through iteration and feedback.

## LLM as Judge: Consistent Feedback Across Approaches

Both systems use the same validation framework that includes an "LLM as judge" component:

```python
# Check for degenerate transformations
llm_validation_prompt = f"""
Analyze if this VRL transformation is degenerate (just dumps everything into raw_data):
{vrl_code}

Expected fields for {sourcetype}: {expected_fields}
"""
```

This ensures transformations actually parse and map data rather than taking shortcuts. The feedback from this validation is utilized similarly in both approaches:
- **Homegrown agent**: Receives feedback through tool responses
- **Claude Code**: Reads test output and error messages

## Pros and Cons Analysis

### Homegrown Agent

**Pros:**
- Full control over conversation flow and tool usage
- Explicit state management and debugging
- Can enforce strict constraints (e.g., limiting schema queries)
- Custom summarization strategies for context management

**Cons:**
- Significant engineering overhead
- Complex context compression logic
- Rigid tool-based interaction pattern
- Harder to iterate on agent behavior

### Claude Code

**Pros:**
- Leverages battle-tested context window engineering
- Natural file-based interface for code generation
- Built-in support for iterative development
- Excellent observability through file system
- More flexible and autonomous operation

**Cons:**
- Less direct control over agent behavior
- Requires structuring everything as files
- May use more tokens without explicit summarization
- Black box internals

## The Generality of Claude Code as an Agentic Backbone

What makes Claude Code particularly powerful as an agentic backbone is its generality:

1. **File-Based Interface**: Any problem that can be expressed as file manipulation works naturally
2. **Test-Driven Loop**: The test command provides a universal way to define success criteria
3. **Context Management**: Claude Code is already optimized for handling large codebases and file contexts
4. **Persistence**: The `claude_thoughts.md` file maintains context across iterations

This makes it suitable for many agentic workflows beyond VRL generation:
- Code refactoring with test suites
- Configuration file generation with validation
- Documentation generation with quality checks
- Data transformation pipeline development

## Key Takeaways

1. **Start with the Test**: Defining clear exit criteria through tests is crucial for agentic systems

2. **Embrace File-Based Workflows**: Files provide natural boundaries and excellent observability

3. **Let the Framework Handle Context**: Claude Code's built-in context management is more sophisticated than most homegrown solutions

4. **Feedback Quality Matters**: Whether through tools or tests, high-quality feedback drives better iterations

5. **Observability is Essential**: The working directory approach with snapshots provides invaluable debugging information

## Conclusion

The evolution from a homegrown agent to Claude Code represents a shift from building the infrastructure to focusing on the problem domain. While the homegrown approach offers more control, Claude Code provides a cleaner, more maintainable solution that leverages years of optimization for code generation tasks.

For problems that fit the pattern of "iteratively generate artifacts until they pass validation," Claude Code emerges as an excellent agentic backbone. The VRL transformation use case demonstrates this perfectly—complex enough to require iteration, structured enough to benefit from file-based workflows, and validation-driven enough to leverage test-based feedback loops.

As we continue to build more agentic systems, frameworks like Claude Code that provide the right abstractions will become increasingly valuable, allowing us to focus on domain-specific challenges rather than reinventing the agentic wheel.