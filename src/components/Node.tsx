import React, { useMemo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "../constants/colors";
import Status from "./Status";
import { Node as NodeType } from "../types/Node";
import { RootState } from "../store/configureStore";
import { ShapeBlock } from "../types/Blocks";

type Props = {
  node: NodeType;
  expanded: boolean;
  toggleNodeExpanded: (node: NodeType) => void;
  arrayOfBlocks: RootState;
};

const AccordionRoot = styled(Accordion)({
  margin: "16px 0",
  boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.15)",

  "&:before": {
    backgroundColor: "unset",
  },
});

const AccordionSummaryContainer = styled(AccordionSummary)<{disabledicon:string}>(({ disabledicon }) => {
  return {
    padding: "0 24px",
    "& .MuiAccordionSummary-content": {
      margin: "10px 0 !important", // Avoid change of sizing on expanded
      "&:hover":{
        cursor: disabledicon === 'false' ? "not-allowed" : "pointer"
      }
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
      color: colors.faded,
    },
    "&:last-child": {
      backgroundColor:"#000"
    }
  };
});

const BoxSummaryContent = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingRight: 20,
});

const BoxNodeContent = styled(Box)({
  width: "100%",
  marginTop: "10px",
  height: "50px",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
});

const BoxNodeTitle = styled(Typography)({
  fontSize: 12,
  display: "block",
  color: colors.blockTitle,
  paddingLeft: "10px",
  paddingTop: "5px",
  fontWeight: "bold",
  marginBottom: "2px",
  letterSpacing: 1.2,
});

const BoxNodeParagraph = styled(Typography)({
  fontSize: 16,
  display: "block",
  color: colors.text,
  paddingLeft: "10px",
});

const TypographyHeading = styled(Typography)({
  fontSize: 17,
  display: "block",
  color: colors.text,
  lineHeight: 1.5,
});

const TypographySecondaryHeading = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: colors.faded,
  lineHeight: 2,
}));

const Node: React.FC<Props> = ({
  node,
  expanded,
  toggleNodeExpanded,
  arrayOfBlocks,
}) => {
  const memoizedListOfBlocks = useMemo((): ShapeBlock[] => {
    let filteredArrayOfBlocks = [];
    if (arrayOfBlocks) {
      if (arrayOfBlocks.blocks && expanded) {
        filteredArrayOfBlocks.push(
          arrayOfBlocks.blocks.filter((block) => block.url === node.url)[0]
        );
      }
    }

    return filteredArrayOfBlocks;
  }, [arrayOfBlocks, expanded, node.url]);

  return (
    <AccordionRoot
      elevation={3}
      expanded={expanded}
      onChange={() => toggleNodeExpanded(node)}
    >
      <AccordionSummaryContainer
        expandIcon={<ExpandMoreIcon />}
        disabledicon={node.online.toString()}
      >
        <BoxSummaryContent>
          <Box>
            <TypographyHeading variant="h5">
              {node.name || "Unknown"}
            </TypographyHeading>
            <TypographySecondaryHeading variant="subtitle1">
              {node.url}
            </TypographySecondaryHeading>
          </Box>
          <Status loading={node.loading} online={node.online} />
        </BoxSummaryContent>
      </AccordionSummaryContainer>
      <AccordionDetails>
        {expanded &&
          memoizedListOfBlocks[0].data?.map((item) => {
            return (
              <BoxNodeContent key={item.id} style={{ marginTop: "10px" }}>
                <BoxNodeTitle variant="h4">00{item.id}</BoxNodeTitle>
                <BoxNodeParagraph variant="body2">
                  {item.attributes.data}
                </BoxNodeParagraph>
              </BoxNodeContent>
            );
          })}
      </AccordionDetails>
    </AccordionRoot>
  );
};

export default Node;
