import React, { useState, useEffect } from "react";
import { Node as NodeType } from "../types/Node";
import Node from "../components/Node";
import { Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/configureStore";
import { checkNodesStatus, selectNodes } from "../reducers/nodes/nodes";
import { checkBlocksStatus, selectBlocks } from "../reducers/blocks/blocks";
import { toast } from "react-toastify";

export const Nodes: React.FC = () => {
  const [expandedNodeURL, setExpandedNodeURL] = useState<null | string>(null);
  const dispatch = useDispatch();
  const nodes = useAppSelector(selectNodes);
  const blocks = useAppSelector(selectBlocks);
  const [isLoadingBlock, setIsLoadingBlocks] = useState(true);

  useEffect(() => {
    dispatch(checkNodesStatus(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoadingBlock) {
      toast.loading("Loading blocks...");
    }
  }, [isLoadingBlock]);

  useEffect(() => {
    if (nodes.length >= 2) {
      dispatch(checkBlocksStatus(nodes));
      setIsLoadingBlocks(false);
    }
    return () => {
      toast.dismiss();
    };
  }, [dispatch, nodes]);

  function toggleNodeExpanded(node: NodeType) {
    const nodeIsOnline = node.online;

    if (!nodeIsOnline) {
      toast.warning(`Node ${node.url} is offline`);
      return;
    }

    setExpandedNodeURL(node.url === expandedNodeURL ? null : node.url);
  }

  return (
    <Box paddingTop={7}>
      <Typography variant="h4" component="h1">
        <strong style={{ color: "#000" }}>Nodes</strong>
      </Typography>
      {nodes.map((node) => (
        <Node
          node={node}
          key={node.url}
          expanded={node.url === expandedNodeURL}
          toggleNodeExpanded={toggleNodeExpanded}
          arrayOfBlocks={blocks}
        />
      ))}
    </Box>
  );
};

export default Nodes;
