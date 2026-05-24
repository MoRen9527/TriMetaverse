"""TriCompany metacognition runtime prototype.

This package hosts the first local prototype for the shared metacognition
kernel, per-employee private namespaces, and the company-level shared
memory space.
"""

from runtime.cognition.chief_of_staff_cognition import (
	CHIEF_OF_STAFF_ID,
	build_ceo_chief_of_staff_kernel,
	default_ceo_chief_of_staff_asset_sources,
)

from runtime.cognition.chief_of_staff_workflow_bridge import (
	ChiefOfStaffWorkflowBridge,
)

__all__ = [
	"CHIEF_OF_STAFF_ID",
	"ChiefOfStaffWorkflowBridge",
	"build_ceo_chief_of_staff_kernel",
	"default_ceo_chief_of_staff_asset_sources",
]
